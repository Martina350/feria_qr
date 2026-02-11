import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEntriesDashboard() {
    const totalStudents = await this.prisma.student.count();

    const byGender = await this.prisma.student.groupBy({
      by: ['gender'],
      _count: { _all: true },
    });

    const students = await this.prisma.student.findMany({
      select: {
        id: true,
        age: true,
        gender: true,
        unitEducation: true,
        city: true,
        province: true,
      },
    });

    const byAgeRange: Record<string, number> = {};

    const ranges = [
      { key: '5-8', min: 5, max: 8 },
      { key: '9-12', min: 9, max: 12 },
      { key: '13-17', min: 13, max: 17 },
      { key: '18-25', min: 18, max: 25 },
      { key: '26+', min: 26, max: 200 },
    ];

    for (const r of ranges) {
      byAgeRange[r.key] = students.filter(
        (s) => s.age >= r.min && s.age <= r.max,
      ).length;
    }

    const byEducationUnit: Record<string, number> = {};
    for (const s of students) {
      byEducationUnit[s.unitEducation] =
        (byEducationUnit[s.unitEducation] ?? 0) + 1;
    }

    return {
      totalStudents,
      byGender: byGender.map((g) => ({
        gender: g.gender,
        count: g._count._all,
      })),
      byAgeRange,
      byEducationUnit,
    };
  }

  async getStandsDashboard() {
    const stands = await this.prisma.stand.findMany({
      select: {
        id: true,
        name: true,
        cooperativeName: true,
        contentType: true,
      },
    });

    const completions = await this.prisma.activityCompletion.findMany({
      select: {
        standId: true,
        studentId: true,
        contentType: true,
        student: {
          select: {
            age: true,
            gender: true,
          },
        },
      },
    });

    const byStand: Record<
      string,
      {
        totalStudents: number;
        byGender: Record<string, number>;
        byAgeRange: Record<string, number>;
        byContentType: Record<string, number>;
      }
    > = {};

    const ageRanges = [
      { key: '5-8', min: 5, max: 8 },
      { key: '9-12', min: 9, max: 12 },
      { key: '13-17', min: 13, max: 17 },
      { key: '18-25', min: 18, max: 25 },
      { key: '26+', min: 26, max: 200 },
    ];

    const seenStudentsPerStand = new Map<string, Set<string>>();

    for (const c of completions) {
      if (!byStand[c.standId]) {
        byStand[c.standId] = {
          totalStudents: 0,
          byGender: {},
          byAgeRange: {},
          byContentType: {},
        };
        ageRanges.forEach((r) => (byStand[c.standId].byAgeRange[r.key] = 0));
      }

      if (!seenStudentsPerStand.has(c.standId)) {
        seenStudentsPerStand.set(c.standId, new Set<string>());
      }

      const set = seenStudentsPerStand.get(c.standId)!;
      if (!set.has(c.studentId)) {
        set.add(c.studentId);
        byStand[c.standId].totalStudents += 1;

        const gender = c.student.gender;
        byStand[c.standId].byGender[gender] =
          (byStand[c.standId].byGender[gender] ?? 0) + 1;

        const age = c.student.age;
        const range = ageRanges.find((r) => age >= r.min && age <= r.max);
        if (range) {
          byStand[c.standId].byAgeRange[range.key] += 1;
        }
      }

      const ct = c.contentType;
      byStand[c.standId].byContentType[ct] =
        (byStand[c.standId].byContentType[ct] ?? 0) + 1;
    }

    return stands.map((s) => ({
      ...s,
      metrics: byStand[s.id] ?? {
        totalStudents: 0,
        byGender: {},
        byAgeRange: ageRanges.reduce(
          (acc, r) => ({ ...acc, [r.key]: 0 }),
          {} as Record<string, number>,
        ),
        byContentType: {},
      },
    }));
  }

  async getMyStandDashboard(standId: string) {
    if (!standId) {
      return null;
    }

    const stand = await this.prisma.stand.findUnique({
      where: { id: standId },
    });

    if (!stand) {
      return null;
    }

    const [result] = await this.getStandsDashboard().then((all) =>
      all.filter((s) => s.id === standId),
    );

    return result ?? { ...stand, metrics: null };
  }
}



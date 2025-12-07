const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const posts = await prisma.post.findMany({
    where: { seriesId: { not: null } },
    select: { scheduledFor: true, publishedAt: true, status: true, title: true, seriesOrder: true },
    orderBy: { seriesOrder: 'asc' }
  });

  const byDate = {};
  posts.forEach(p => {
    const date = p.scheduledFor
      ? p.scheduledFor.toISOString().split('T')[0]
      : (p.publishedAt ? p.publishedAt.toISOString().split('T')[0] : 'no-date');
    byDate[date] = (byDate[date] || 0) + 1;
  });

  console.log('Posts scheduled per date:');
  console.log('========================');
  Object.keys(byDate).sort().forEach(d => console.log(d + ': ' + byDate[d] + ' post(s)'));
  console.log('========================');
  console.log('Total posts in series: ' + posts.length);

  // Verify week counts
  const weeks = {
    'Week 1 (Dec 8-12)': ['2025-12-08', '2025-12-10', '2025-12-12'],
    'Week 2 (Dec 15-19)': ['2025-12-15', '2025-12-18'],
    'Week 3 (Dec 22-26)': ['2025-12-22', '2025-12-24', '2025-12-26'],
    'Week 4 (Dec 29-Jan 2)': ['2025-12-29', '2026-01-02'],
    'Week 5 (Jan 5-9)': ['2026-01-05', '2026-01-07', '2026-01-09'],
    'Week 6 (Jan 12-16)': ['2026-01-12', '2026-01-16'],
    'Week 7 (Jan 19-23)': ['2026-01-19', '2026-01-21', '2026-01-23'],
    'Week 8 (Jan 26-30)': ['2026-01-26', '2026-01-30'],
    'Week 9 (Feb 2-6)': ['2026-02-02', '2026-02-04', '2026-02-06'],
    'Week 10 (Feb 9-13)': ['2026-02-09', '2026-02-13']
  };

  console.log('\nWeek validation:');
  console.log('================');
  let total = 0;
  for (const [week, dates] of Object.entries(weeks)) {
    const count = dates.reduce((sum, d) => sum + (byDate[d] || 0), 0);
    total += count;
    const expected = dates.length;
    const status = count === expected ? 'PASS' : 'FAIL';
    console.log(`${week}: ${count}/${expected} posts [${status}]`);
  }
  console.log('================');
  console.log(`Total scheduled: ${total}`);

  await prisma.$disconnect();
}

verify().catch(console.error);

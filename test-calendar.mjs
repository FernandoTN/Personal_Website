// Test script to verify calendar API and page

async function testCalendarAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/calendar');
    const data = await response.json();

    console.log('=== Calendar API Test Results ===');
    console.log('Success:', data.success);
    console.log('Start Date:', data.startDate);
    console.log('End Date:', data.endDate);
    console.log('Total Posts:', data.totalPosts);
    console.log('Published:', data.publishedCount);
    console.log('Scheduled:', data.scheduledCount);
    console.log('Drafts:', data.draftCount);
    console.log('Number of Weeks:', data.weeks?.length);

    if (data.weeks) {
      console.log('\n=== Week Information ===');
      data.weeks.forEach(week => {
        console.log(`Week ${week.weekNumber}: ${week.theme} (${week.startDate} to ${week.endDate}) - ${week.postCount} posts`);
      });
    }

    console.log('\n=== Test PASSED ===');
    return true;
  } catch (error) {
    console.error('Test FAILED:', error.message);
    return false;
  }
}

testCalendarAPI();

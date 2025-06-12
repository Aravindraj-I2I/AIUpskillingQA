export function splitTestDataAcrossPlans(testData, plans) {
  const perPlan = Math.floor(testData.length / plans.length);

  return plans.map((plan, i) => {
    const extra = i < testData.length % plans.length ? 1 : 0;
    const start = i * perPlan + Math.min(i, testData.length % plans.length);
    const end = start + perPlan + extra;
    return { ...plan, data: testData.slice(start, end) };
  });
}

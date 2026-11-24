import { STATES_2026, getState, type StateDef } from "./states2026";
import { calculatePaycheck } from "./paycheck";

/**
 * Curated list of top comparison, relocation, and neighboring states for each jurisdiction.
 * If a state is not explicitly listed, we default to its logical geographic/tax peers.
 */
const NEIGHBOR_MAP: Record<string, string[]> = {
  california: ["texas", "nevada", "arizona", "washington", "oregon"],
  "new-york": ["new-jersey", "connecticut", "florida", "pennsylvania", "massachusetts"],
  texas: ["florida", "california", "colorado", "oklahoma", "louisiana"],
  florida: ["texas", "georgia", "new-york", "north-carolina", "tennessee"],
  illinois: ["indiana", "wisconsin", "missouri", "iowa", "texas"],
  pennsylvania: ["new-jersey", "new-york", "ohio", "maryland", "delaware"],
  ohio: ["indiana", "pennsylvania", "michigan", "kentucky", "west-virginia"],
  georgia: ["florida", "north-carolina", "south-carolina", "tennessee", "alabama"],
  "north-carolina": ["south-carolina", "virginia", "georgia", "tennessee", "florida"],
  michigan: ["ohio", "indiana", "illinois", "wisconsin", "florida"],
  "new-jersey": ["new-york", "pennsylvania", "delaware", "connecticut", "florida"],
  virginia: ["maryland", "district-of-columbia", "north-carolina", "west-virginia", "florida"],
  washington: ["oregon", "california", "idaho", "texas", "nevada"],
  arizona: ["california", "nevada", "utah", "new-mexico", "texas"],
  massachusetts: ["new-hampshire", "rhode-island", "connecticut", "new-york", "florida"],
  tennessee: ["kentucky", "virginia", "north-carolina", "georgia", "florida"],
  indiana: ["illinois", "michigan", "ohio", "kentucky", "texas"],
  missouri: ["illinois", "kansas", "iowa", "arkansas", "tennessee"],
  maryland: ["virginia", "district-of-columbia", "pennsylvania", "delaware", "florida"],
  wisconsin: ["minnesota", "illinois", "iowa", "michigan", "florida"],
  colorado: ["utah", "wyoming", "new-mexico", "texas", "arizona"],
  minnesota: ["wisconsin", "iowa", "north-dakota", "south-dakota", "florida"],
  "south-carolina": ["north-carolina", "georgia", "florida", "tennessee", "virginia"],
  alabama: ["georgia", "florida", "tennessee", "mississippi", "texas"],
  louisiana: ["texas", "arkansas", "mississippi", "florida", "georgia"],
  kentucky: ["indiana", "ohio", "tennessee", "west-virginia", "illinois"],
  oregon: ["washington", "california", "idaho", "nevada", "texas"],
  oklahoma: ["texas", "kansas", "arkansas", "missouri", "colorado"],
  connecticut: ["new-york", "massachusetts", "rhode-island", "new-jersey", "florida"],
  utah: ["nevada", "arizona", "colorado", "idaho", "wyoming"],
  iowa: ["illinois", "minnesota", "wisconsin", "missouri", "nebraska"],
  nevada: ["california", "arizona", "utah", "oregon", "idaho"],
  arkansas: ["missouri", "tennessee", "mississippi", "louisiana", "texas"],
  mississippi: ["alabama", "tennessee", "louisiana", "arkansas", "florida"],
  kansas: ["missouri", "nebraska", "colorado", "oklahoma", "texas"],
  "new-mexico": ["arizona", "colorado", "texas", "utah", "oklahoma"],
  nebraska: ["iowa", "kansas", "south-dakota", "colorado", "wyoming"],
  idaho: ["washington", "oregon", "utah", "nevada", "montana"],
  "west-virginia": ["virginia", "maryland", "pennsylvania", "ohio", "kentucky"],
  hawaii: ["california", "washington", "nevada", "texas", "florida"],
  "new-hampshire": ["massachusetts", "vermont", "maine", "florida", "texas"],
  maine: ["new-hampshire", "massachusetts", "vermont", "florida", "new-york"],
  "rhode-island": ["massachusetts", "connecticut", "new-york", "florida", "new-hampshire"],
  montana: ["idaho", "wyoming", "north-dakota", "south-dakota", "washington"],
  delaware: ["maryland", "pennsylvania", "new-jersey", "virginia", "florida"],
  "south-dakota": ["north-dakota", "minnesota", "iowa", "nebraska", "wyoming"],
  "north-dakota": ["minnesota", "south-dakota", "montana", "texas", "florida"],
  alaska: ["washington", "oregon", "california", "texas", "florida"],
  "district-of-columbia": ["maryland", "virginia", "pennsylvania", "new-york", "florida"],
  vermont: ["new-hampshire", "massachusetts", "new-york", "maine", "florida"],
  wyoming: ["colorado", "utah", "idaho", "montana", "south-dakota"],
};

export interface StateComparisonItem {
  state: StateDef;
  netDiffAnnual: number;
  netDiffMonthly: number;
  benchmarkNet: number;
  taxSummary: string;
}

const BENCHMARK_SALARY = 100000;

export function getComparisonStates(currentSlug: string): StateComparisonItem[] {
  const currentState = getState(currentSlug);
  if (!currentState) return [];

  const currentResult = calculatePaycheck({
    grossAnnual: BENCHMARK_SALARY,
    filing: "single",
    preTaxAnnual: 0,
    periodsPerYear: 26,
    state: currentState,
  });

  const targetSlugs = NEIGHBOR_MAP[currentSlug] || ["texas", "florida", "washington", "nevada", "california"];

  return targetSlugs
    .map((slug) => getState(slug))
    .filter((st): st is StateDef => Boolean(st && st.slug !== currentSlug))
    .map((st) => {
      const compResult = calculatePaycheck({
        grossAnnual: BENCHMARK_SALARY,
        filing: "single",
        preTaxAnnual: 0,
        periodsPerYear: 26,
        state: st,
      });

      const netDiffAnnual = Math.round(compResult.net - currentResult.net);
      const netDiffMonthly = Math.round(netDiffAnnual / 12);

      let taxSummary = "No state wage tax";
      if (!st.none && st.single) {
        const topRate = Math.max(...st.single.map((b) => b[1]));
        taxSummary = st.single.length === 1 ? `Flat ${topRate}%` : `Up to ${topRate}%`;
      }

      return {
        state: st,
        netDiffAnnual,
        netDiffMonthly,
        benchmarkNet: Math.round(compResult.net),
        taxSummary,
      };
    });
}

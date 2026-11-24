import type { ComponentType } from "react";
import AutoLoanCalculator from "./AutoLoanCalculator";
import BonusTaxCalculator from "./BonusTaxCalculator";
import CagrCalculator from "./CagrCalculator";
import CompoundInterestCalculator from "./CompoundInterestCalculator";
import CreditCardPayoffCalculator from "./CreditCardPayoffCalculator";
import DebtSnowballCalculator from "./DebtSnowballCalculator";
import HourlyToSalaryCalculator from "./HourlyToSalaryCalculator";
import InflationCalculator from "./InflationCalculator";
import MortgageAffordabilityCalculator from "./MortgageAffordabilityCalculator";
import MortgageCalculator from "./MortgageCalculator";
import PaycheckCalculator from "./PaycheckCalculator";
import RefinanceBreakEvenCalculator from "./RefinanceBreakEvenCalculator";
import RentVsBuyCalculator from "./RentVsBuyCalculator";
import Retirement401kCalculator from "./Retirement401kCalculator";
import RoiCalculator from "./RoiCalculator";
import RothVsTraditionalIraCalculator from "./RothVsTraditionalIraCalculator";
import SelfEmploymentTaxCalculator from "./SelfEmploymentTaxCalculator";
import StudentLoanPayoffCalculator from "./StudentLoanPayoffCalculator";
import AmortizationSchedule from "./AmortizationSchedule";

export const CALCULATOR_COMPONENTS: Record<string, ComponentType> = {
  "auto-loan-calculator": AutoLoanCalculator,
  "bonus-tax-calculator": BonusTaxCalculator,
  "cagr-calculator": CagrCalculator,
  "compound-interest-calculator": CompoundInterestCalculator,
  "credit-card-payoff-calculator": CreditCardPayoffCalculator,
  "debt-snowball-calculator": DebtSnowballCalculator,
  "hourly-to-salary-calculator": HourlyToSalaryCalculator,
  "investments-vs-inflation-calculator": InflationCalculator,
  "mortgage-affordability-calculator": MortgageAffordabilityCalculator,
  "mortgage-calculator": MortgageCalculator,
  "salary-after-tax": PaycheckCalculator,
  "refinance-break-even-calculator": RefinanceBreakEvenCalculator,
  "rent-vs-buy-calculator": RentVsBuyCalculator,
  "401k-calculator": Retirement401kCalculator,
  "roi-calculator": RoiCalculator,
  "roth-vs-traditional-ira-calculator": RothVsTraditionalIraCalculator,
  "self-employment-tax-calculator": SelfEmploymentTaxCalculator,
  "student-loan-payoff-calculator": StudentLoanPayoffCalculator,
  "amortization-schedule": AmortizationSchedule,
};

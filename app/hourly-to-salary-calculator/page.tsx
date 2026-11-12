import CalculatorLayout from "@/components/CalculatorLayout";
import HourlyToSalaryCalculator from "@/components/HourlyToSalaryCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("hourly-to-salary-calculator");

const faqs = [
  {
    q: "How do I convert an hourly wage to an annual salary?",
    a: "Multiply the hourly rate by the hours you work each week, then by the number of paid weeks in the year. At 40 hours a week for 52 weeks, $25 an hour is $25 × 40 × 52 = $52,000 a year. If you work 50 weeks instead of 52, the same rate is $50,000. Add overtime separately by multiplying the overtime hours by the rate and by the overtime multiplier (normally 1.5).",
  },
  {
    q: "What is $20 an hour annually?",
    a: "$20 an hour at 40 hours a week for 52 weeks is $41,600 a year. That is $3,466.67 a month, $1,600 every two weeks, $800 a week and $160 a day across a five-day week. Once you add deductions such as federal tax, Social Security and Medicare, the take-home figure is lower — use the paycheck calculator to estimate net pay.",
  },
  {
    q: "How do I turn a salary back into an hourly rate?",
    a: "Divide the annual salary by the total hours worked in the year. For a 40-hour, 52-week schedule the divisor is 2,080 hours, so a $60,000 salary is $60,000 ÷ 2,080 = $28.85 an hour. If you are paid for 50 weeks (2,000 hours) the same salary works out to $30 an hour, because each paid hour has to cover fewer hours of work.",
  },
  {
    q: "Does overtime change my effective hourly rate?",
    a: "Yes. Overtime is paid at a higher multiplier, so it lifts your average pay per hour. Someone on $20 an hour who works 10 overtime hours a week at time-and-a-half earns $1,100 a week instead of $800. Over 50 hours that is an effective rate of $22 an hour, even though the base rate is still $20.",
  },
  {
    q: "Why do some people use 2,080 hours and others 2,000?",
    a: "2,080 hours assumes 40 hours a week for 52 weeks. Many salaried roles quote 2,000 hours to allow two weeks of unpaid time off, and a few employers subtract public holidays as well. Because the divisor changes the hourly equivalent, always check which convention your employer uses before comparing a salary offer against an hourly job.",
  },
  {
    q: "Is this the same as my take-home pay?",
    a: "No. This calculator converts between an hourly rate and gross pay before any deductions. Your banked amount is smaller once federal income tax, Social Security (6.2% up to $184,500 of wages), Medicare (1.45%) and any state tax are withheld. Enter the gross salary shown here into the paycheck calculator to estimate what actually lands in your account.",
  },
];

export default function HourlyToSalaryCalculatorPage() {
  return (
    <CalculatorLayout
      slug="hourly-to-salary-calculator"
      intro={
        <p>
          Convert between an hourly wage and an annual salary in either direction. Enter a rate to see
          the yearly, monthly, bi-weekly, weekly and daily gross pay, or enter a salary to see the
          equivalent hourly rate — with optional overtime. Everything is calculated in your browser.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the hourly to salary calculator works</h2>
          <p>
            An hourly job pays you for every hour you work, so the annual figure depends on three
            things: the rate, the hours per week, and the number of paid weeks in the year. The
            salary calculator simply multiplies them together, then divides the annual total into the
            pay periods you actually see on a payslip.
          </p>

          <h3>The formulas</h3>
          <p>The core conversion is a single multiplication for base pay:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            annual salary = hourly rate × hours per week × weeks per year
          </p>
          <p>Overtime is added on top, at the multiplier the employer uses (usually 1.5):</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            overtime pay = overtime hours × hourly rate × multiplier
          </p>
          <p>
            With the annual number in hand, the other periods follow directly: monthly is the annual
            figure divided by 12, bi-weekly by 26, weekly by the number of weeks you entered, and the
            daily figure spreads a week across five working days. The <em>effective hourly rate</em>{" "}
            divides the total pay by every hour worked, including overtime, so you can compare an
            hourly job with a salaried one on equal footing.
          </p>

          <h3>Worked example</h3>
          <p>
            Suppose you earn $25 an hour and work 40 hours a week for 52 weeks with no overtime. The
            annual salary is $25 × 40 × 52 = $52,000. That is $4,333.33 a month, $2,000 every two
            weeks, $1,000 a week and $200 a day. Now add 10 overtime hours a week at time-and-a-half:
            the extra pay is 10 × $25 × 1.5 = $375 a week, or $19,500 a year, lifting the salary to
            $71,500 and the average pay per hour to about $28.60.
          </p>

          <h3>Converting a salary to an hourly rate</h3>
          <p>
            The reverse direction divides the salary by the annual hours. A $60,000 salary on a
            40-hour, 52-week schedule is $60,000 ÷ 2,080 ≈ $28.85 an hour. Drop to 50 weeks and the
            same salary is $30 an hour, because you are being paid for the same money over fewer
            working hours. This is why comparing a salaried offer with an hourly job needs a consistent
            weeks-per-year assumption — the calculator lets you set it directly.
          </p>

          <h3>What this calculator leaves out</h3>
          <p>
            These are gross figures. They ignore unpaid breaks, shift differentials, holiday and
            vacation policy, bonuses, commissions, tips and any employer contributions. They also do
            not subtract tax — Social Security, Medicare, federal and state income tax all reduce take-
            home pay below the numbers shown here. Use the figures as a like-for-like pay comparison,
            then take the salary to the paycheck calculator to see what you actually keep.
          </p>
        </>
      }
    >
      <HourlyToSalaryCalculator />
    </CalculatorLayout>
  );
}

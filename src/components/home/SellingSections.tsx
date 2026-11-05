import { BILL_LEDE, DAILY, FOUNDING_OPEN } from '../../data/pages/home-sections';
import { BILL_SIZES, barWidth, billAt, DEFAULT_BILL_SIZE } from '../../lib/team-bill';
import { SWITCH_CALL_HREF } from '../../lib/site';
import { SectionIntro } from './SectionIntro';

const usd = (n: number): string => `$${n.toLocaleString('en-US')}`;

// The bill by team size. The picker is four radios and every size's bars are in the page, so it works
// without JavaScript: styles.css shows the bars of the checked size with :has(). Browsers without
// :has() see the 10-agent bars and no picker.
function Bill() {
  return (
    <section className="bill" aria-labelledby="bill">
      <SectionIntro id="bill" eyebrow="Your bill, by team size" title="Freshdesk charges per agent, then again for AI." lede={BILL_LEDE}>
        <fieldset className="bill-picker">
          <legend>Agents</legend>
          <div className="segmented">
            {BILL_SIZES.map((n) => (
              <label key={n}><input type="radio" name="bill-size" value={n} defaultChecked={n === DEFAULT_BILL_SIZE} />{n}</label>
            ))}
          </div>
        </fieldset>
      </SectionIntro>
      <div className="sheet-row bill-states">
        {BILL_SIZES.map((n) => {
          const bars = billAt(n, FOUNDING_OPEN);
          const max = Math.max(...bars.map((b) => b.usd));
          return (
            <ol key={n} className="bill-bars" data-size={n} aria-label={`Yearly cost for ${n} agents`}>
              {bars.map((b) => (
                <li key={b.name} className={b.ours ? 'bill-bar bill-ours' : 'bill-bar'}>
                  <p className="bill-label"><b>{b.name}</b><span>{b.math}</span></p>
                  <p className="bill-track">
                    <span className="bill-fill" style={{ width: barWidth(b.usd, max) }} />
                    <b>{usd(b.usd)}<span>/yr</span></b>
                    {b.call && <a className="btn btn-sm" href={SWITCH_CALL_HREF} rel="noopener">Book a 30-minute call</a>}
                  </p>
                </li>
              ))}
            </ol>
          );
        })}
      </div>
    </section>
  );
}

// What a team uses every day, each with a crop of the product. On a phone two crops stay (the owner and
// the help center); the other four items keep their words.
function Daily() {
  return (
    <section aria-labelledby="daily">
      <SectionIntro
        id="daily"
        eyebrow="Every day"
        title="What your team uses every day already works."
        lede={<>HC Labs answers its own customers in it. Not built yet: automations and macros. Freshdesk still does more there: <a href="/vs/freshdesk">read Colliedesk vs Freshdesk before you decide <span aria-hidden="true">→</span></a></>}
      />
      <ul className="sheet-row cells cells-grid daily">
        {DAILY.map(([title, text, image, alt]) => (
          <li key={title} className={`cell daily-${image}`}>
            <img src={`/daily-${image}.webp`} width="335" height="160" alt={alt} loading="lazy" decoding="async" />
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// The bill by team size, then the everyday basics, after the AI agent section.
export function SellingSections() {
  return (
    <>
      <Bill />
      <Daily />
    </>
  );
}

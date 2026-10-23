import { FOUNDING_SLOTS, placesLeft, type FoundingState } from '../lib/founding';
import { PRICE } from '../lib/site';

// One square per founding place, taken ones greyed, next to the buy button, followed by the price
// that applies once the places run out: the reader sees both how many are left and what it costs to
// wait. Until the first place is taken, or when the count is unknown, it names the offer without a
// counter: "10 of 10 places left" beside ten empty squares reads as "nobody bought". Renders nothing
// when founding is closed; the caller shows the closed copy.
export function FoundingMeter({ state }: { state: FoundingState }) {
  if (!state.open) return null;
  const left = placesLeft(state);
  const after = `then Cloud Team at ${PRICE.yearly} a year`;
  if (left === null || left === FOUNDING_SLOTS) {
    return <p className="founding-meter-count">{FOUNDING_SLOTS} Founding places, {after}</p>;
  }
  const taken = FOUNDING_SLOTS - left;
  return (
    <div className="founding-meter">
      <ol className="founding-slots" aria-hidden="true">
        {Array.from({ length: FOUNDING_SLOTS }, (_, index) => (
          <li key={index} className={index < taken ? 'founding-slot founding-slot-taken' : 'founding-slot'} />
        ))}
      </ol>
      <p className="founding-meter-count">
        <strong>{left}</strong> of {FOUNDING_SLOTS} places left, {after}
      </p>
    </div>
  );
}

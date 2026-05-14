export { artist } from "./artist.js";
export { bookworm } from "./bookworm.js";
export { bully } from "./bully.js";
export { dreamer } from "./dreamer.js";
export { follower } from "./follower.js";
export { groundskeeper } from "./groundskeeper.js";
export { klutz } from "./klutz.js";
export { performer } from "./performer.js";
export { potioneer } from "./potioneer.js";
export { prodigy } from "./prodigy.js";
export { protector } from "./protector.js";
export { quidditchFan } from "./quidditch-fan.js";
export { socialite } from "./socialite.js";
export { troublemaker } from "./troublemaker.js";

// All entries as an array
import { artist, bookworm, bully, dreamer, follower, groundskeeper, klutz, performer, potioneer, prodigy, protector, quidditchFan, socialite, troublemaker } from "./index.js";
import type { Background } from "../../schemas/index.js";
export const all: Background[] = [artist, bookworm, bully, dreamer, follower, groundskeeper, klutz, performer, potioneer, prodigy, protector, quidditchFan, socialite, troublemaker];

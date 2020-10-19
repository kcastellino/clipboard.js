// Shim to ensure that this fork can act as a drop-in replacement for upstream clipboard.js

import { ClipboardListener as Clipboard } from "./clipboard-handler";
export default Clipboard;
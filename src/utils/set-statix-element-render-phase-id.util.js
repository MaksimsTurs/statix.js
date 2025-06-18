import { G_STATIX_SYMBOL_SET_PHASE_ID } from "../../SYMBOL.const.js";

export default function setStatixElementRenderPhaseId(instance, phaseId) {
	instance[G_STATIX_SYMBOL_SET_PHASE_ID](phaseId);
}
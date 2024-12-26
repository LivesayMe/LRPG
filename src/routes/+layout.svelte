<script>
	import '../app.postcss';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!--Top Navbar-->
<div class="w-full h-50 bg-surface-100 flex flex-row justify-between items-center p-5">
	<a href="/items" class="btn variant-filled-primary">
		Items
	</a>
	<a href="/zones" class="btn variant-filled-primary">
		Zones
	</a>
</div>


<slot />

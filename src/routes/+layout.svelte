<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Hangman Party - Ahorcado Multijugador</title>
	<meta name="description" content="Juego de Ahorcado multijugador en tiempo real. Juega solo o con amigos en modo equipo o competitivo." />
</svelte:head>

<div class="min-h-screen flex flex-col">
	{@render children()}
</div>

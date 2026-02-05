<script lang="ts">
	import Modal from './Modal.svelte';
	import { monitors } from '$lib/stores';
	import type { MarkerType, ThreatLevel } from '$lib/types';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open = false, onClose }: Props = $props();

	// Form state
	let name = $state('');
	let markerType = $state<MarkerType>('hotspot');
	let lat = $state('');
	let lon = $state('');
	let description = $state('');
	let threatLevel = $state<ThreatLevel>('elevated');
	let error = $state('');

	// Marker type options with icons and colors
	const markerTypes: { value: MarkerType; label: string; icon: string; color: string }[] = [
		{ value: 'hotspot', label: 'Hotspot', icon: '●', color: '#ff4444' },
		{ value: 'chokepoint', label: 'Chokepoint', icon: '◆', color: '#00aaff' },
		{ value: 'cable', label: 'Cable Landing', icon: '◎', color: '#aa44ff' },
		{ value: 'nuclear', label: 'Nuclear Site', icon: '☢', color: '#ffff00' },
		{ value: 'military', label: 'Military Base', icon: '★', color: '#ff00ff' }
	];

	// Threat level options
	const threatLevels: { value: ThreatLevel; label: string; color: string }[] = [
		{ value: 'critical', label: 'Critical', color: '#ff0000' },
		{ value: 'high', label: 'High', color: '#ff4444' },
		{ value: 'elevated', label: 'Elevated', color: '#ffcc00' },
		{ value: 'low', label: 'Low', color: '#00ff88' }
	];

	// Reset form when modal opens
	$effect(() => {
		if (open) {
			name = '';
			markerType = 'hotspot';
			lat = '';
			lon = '';
			description = '';
			threatLevel = 'elevated';
			error = '';
		}
	});

	// Get marker color based on type and threat level
	function getMarkerColor(): string {
		if (markerType === 'hotspot') {
			const level = threatLevels.find((t) => t.value === threatLevel);
			return level?.color || '#ffcc00';
		}
		const type = markerTypes.find((t) => t.value === markerType);
		return type?.color || '#00ffff';
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		const trimmedName = name.trim();
		const latNum = parseFloat(lat);
		const lonNum = parseFloat(lon);

		// Validation
		if (!trimmedName) {
			error = 'Name is required';
			return;
		}

		if (isNaN(latNum) || latNum < -90 || latNum > 90) {
			error = 'Latitude must be between -90 and 90';
			return;
		}

		if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
			error = 'Longitude must be between -180 and 180';
			return;
		}

		// Add the marker
		const result = monitors.addMarker({
			name: trimmedName,
			markerType,
			lat: latNum,
			lon: lonNum,
			description: description.trim() || undefined,
			threatLevel: markerType === 'hotspot' ? threatLevel : undefined,
			color: getMarkerColor()
		});

		if (!result) {
			error = 'Maximum number of markers reached (20)';
			return;
		}

		onClose();
	}
</script>

<Modal {open} title="Add Map Data" {onClose}>
	<form class="add-data-form" onsubmit={handleSubmit}>
		{#if error}
			<div class="form-error">{error}</div>
		{/if}

		<div class="form-group">
			<label for="marker-name">Name <span class="required">*</span></label>
			<input
				id="marker-name"
				type="text"
				bind:value={name}
				placeholder="e.g., Strategic Location"
				maxlength="50"
			/>
		</div>

		<div class="form-group">
			<label for="marker-type">Type</label>
			<div class="type-selector">
				{#each markerTypes as type}
					<button
						type="button"
						class="type-option"
						class:selected={markerType === type.value}
						onclick={() => (markerType = type.value)}
					>
						<span class="type-icon" style="color: {type.color}">{type.icon}</span>
						<span class="type-label">{type.label}</span>
					</button>
				{/each}
			</div>
		</div>

		{#if markerType === 'hotspot'}
			<div class="form-group">
				<label for="threat-level">Threat Level</label>
				<div class="threat-selector">
					{#each threatLevels as level}
						<button
							type="button"
							class="threat-option"
							class:selected={threatLevel === level.value}
							onclick={() => (threatLevel = level.value)}
							style="--threat-color: {level.color}"
						>
							<span class="threat-dot" style="background: {level.color}"></span>
							<span>{level.label}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<div class="form-row">
			<div class="form-group half">
				<label for="marker-lat">Latitude <span class="required">*</span></label>
				<input
					id="marker-lat"
					type="number"
					step="any"
					min="-90"
					max="90"
					bind:value={lat}
					placeholder="-90 to 90"
				/>
			</div>

			<div class="form-group half">
				<label for="marker-lon">Longitude <span class="required">*</span></label>
				<input
					id="marker-lon"
					type="number"
					step="any"
					min="-180"
					max="180"
					bind:value={lon}
					placeholder="-180 to 180"
				/>
			</div>
		</div>

		<div class="form-group">
			<label for="marker-description">Description</label>
			<textarea
				id="marker-description"
				bind:value={description}
				placeholder="Optional description for tooltip"
				rows="2"
				maxlength="200"
			></textarea>
		</div>

		<div class="form-actions">
			<button type="button" class="cancel-btn" onclick={onClose}>Cancel</button>
			<button type="submit" class="submit-btn">Add to Map</button>
		</div>
	</form>
</Modal>

<style>
	.add-data-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-error {
		background: rgba(255, 68, 68, 0.1);
		border: 1px solid rgba(255, 68, 68, 0.3);
		border-radius: 4px;
		padding: 0.5rem;
		color: var(--danger);
		font-size: 0.7rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.form-group label {
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.required {
		color: var(--danger);
	}

	.form-group input[type='text'],
	.form-group input[type='number'],
	.form-group textarea {
		padding: 0.5rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--text-primary);
		font-size: 0.75rem;
		font-family: inherit;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--accent);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 60px;
	}

	.form-row {
		display: flex;
		gap: 0.75rem;
	}

	.form-group.half {
		flex: 1;
	}

	/* Type selector */
	.type-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.type-option {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.4rem 0.6rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s ease;
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	.type-option:hover {
		border-color: var(--text-muted);
	}

	.type-option.selected {
		border-color: var(--accent);
		background: rgba(100, 100, 255, 0.1);
	}

	.type-icon {
		font-size: 0.9rem;
	}

	.type-label {
		white-space: nowrap;
	}

	/* Threat level selector */
	.threat-selector {
		display: flex;
		gap: 0.5rem;
	}

	.threat-option {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.5rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s ease;
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	.threat-option:hover {
		border-color: var(--text-muted);
	}

	.threat-option.selected {
		border-color: var(--threat-color);
		background: color-mix(in srgb, var(--threat-color) 10%, transparent);
	}

	.threat-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	/* Form actions */
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.cancel-btn,
	.submit-btn {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-size: 0.7rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.cancel-btn {
		background: transparent;
		border: 1px solid var(--border);
		color: var(--text-secondary);
	}

	.cancel-btn:hover {
		background: var(--border);
		color: var(--text-primary);
	}

	.submit-btn {
		background: var(--accent);
		border: 1px solid var(--accent);
		color: white;
	}

	.submit-btn:hover {
		filter: brightness(1.1);
	}
</style>

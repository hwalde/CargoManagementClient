<!-- src/components/ShipForm.vue -->
<template>
  <div>
    <h3>{{ ship ? 'Schiff bearbeiten' : 'Neues Schiff hinzufügen' }}</h3>
    <form @submit.prevent="saveShip">
      <div>
        <label>Name:</label>
        <input v-model="form.name" required />
      </div>
      <div>
        <label>Kapazität:</label>
        <input type="number" v-model.number="form.capacity" required />
      </div>
      <div>
        <label>Aktueller Standort:</label>
        <input v-model="form.currentLocationName" required />
      </div>
      <div>
        <label>Status:</label>
        <select v-model="form.status" required>
          <option value="DOCKED">Angelegt</option>
          <option value="AT_SEA">Auf See</option>
          <option value="UNDER_MAINTENANCE">In Wartung</option>
        </select>
      </div>
      <button type="submit">Speichern</button>
      <button type="button" @click="$emit('close')">Abbrechen</button>
    </form>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import apiService from '../services/apiService';

export default {
  props: ['ship'],
  setup(props, { emit }) {
    const form = ref({
      name: '',
      capacity: null,
      currentLocationName: '',
      status: 'DOCKED',
    });

    watch(
        () => props.ship,
        newShip => {
          if (newShip) {
            form.value = { ...newShip };
          } else {
            form.value = {
              name: '',
              capacity: null,
              currentLocationName: '',
              status: 'DOCKED',
            };
          }
        },
        { immediate: true }
    );

    const saveShip = () => {
      if (props.ship) {
        // Update
        apiService.updateShip(props.ship.id, form.value).then(() => {
          emit('saved');
          emit('close');
        });
      } else {
        // Create
        apiService.createShip(form.value).then(() => {
          emit('saved');
          emit('close');
        });
      }
    };

    return {
      form,
      saveShip,
    };
  },
};
</script>

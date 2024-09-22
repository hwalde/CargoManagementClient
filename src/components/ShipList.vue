<!-- src/components/ShipList.vue -->
<template>
  <div>
    <h2>Schiffe</h2>
    <button @click="openCreateModal">Neues Schiff hinzufügen</button>
    <ul>
      <li v-for="ship in ships" :key="ship.id">
        {{ ship.name }} - {{ ship.status }}
        <button @click="editShip(ship)">Bearbeiten</button>
        <button @click="deleteShip(ship.id)">Löschen</button>
      </li>
    </ul>
    <ShipForm
        v-if="showForm"
        :ship="selectedShip"
        @close="closeForm"
        @saved="fetchShips"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiService from '../services/apiService';
import ShipForm from './ShipForm.vue';
import webSocketService from '../services/websocketService';

export default {
  components: { ShipForm },
  setup() {
    const ships = ref([]);
    const showForm = ref(false);
    const selectedShip = ref(null);

    const fetchShips = () => {
      apiService.getShips().then(response => {
        ships.value = response.data;
      });
    };

    const openCreateModal = () => {
      selectedShip.value = null;
      showForm.value = true;
    };

    const editShip = ship => {
      selectedShip.value = ship;
      showForm.value = true;
    };

    const deleteShip = id => {
      apiService.deleteShip(id).then(() => {
        fetchShips();
      });
    };

    const closeForm = () => {
      showForm.value = false;
    };

    const handleWebSocketMessage = message => {
      const body = JSON.parse(message.body);
      // Aktualisiere die Schiffsliste basierend auf der Nachricht
      fetchShips();
    };

    onMounted(() => {
      fetchShips();
      webSocketService.connect();
      webSocketService.subscribe('/topic/ships', handleWebSocketMessage);
    });

    return {
      ships,
      showForm,
      selectedShip,
      openCreateModal,
      editShip,
      deleteShip,
      closeForm,
      fetchShips,
    };
  },
};
</script>

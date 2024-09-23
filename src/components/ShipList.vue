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
      const body = message.body;

      if (typeof body === 'string' && body.startsWith('deleted:')) {
        // Nachricht ist ein Löschbefehl
        const idStr = body.replace('deleted:', '');
        const id = parseInt(idStr, 10);
        if (!isNaN(id)) {
          const shipExists = ships.value.some(ship => ship.id === id);
          if (shipExists) {
            ships.value = ships.value.filter(ship => ship.id !== id);
            console.log(`Ship mit ID ${id} wurde gelöscht.`);
          } else {
            console.log(`Ship mit ID ${id} war bereits gelöscht.`);
          }
        } else {
          console.warn('Ungültige Schiff-ID in der Löschnachricht:', body);
        }
      } else {
        try {
          const ship = JSON.parse(body);
          if (typeof ship === 'object' && ship !== null && 'id' in ship) {
            const index = ships.value.findIndex(s => s.id === ship.id);
            if (index !== -1) {
              // Schiff existiert bereits, aktualisieren
              ships.value[index] = ship;
              console.log(`Schiff mit ID ${ship.id} wurde aktualisiert.`);
            } else {
              // Schiff existiert nicht, hinzufügen
              ships.value.push(ship);
              console.log(`Neues Schiff mit ID ${ship.id} wurde hinzugefügt.`);
            }
          } else {
            console.warn('Unbekanntes Nachrichtenformat:', ship);
          }
        } catch (error) {
          console.error('Fehler beim Verarbeiten der WebSocket-Nachricht:', error);
        }
      }
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

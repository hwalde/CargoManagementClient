<!-- src/components/ContainerList.vue -->
<template>
  <div>
    <h2>Container</h2>
    <button @click="openCreateModal">Neuen Container hinzufügen</button>
    <ul>
      <li v-for="container in containers" :key="container.id">
        <strong>ID:</strong> {{ container.id }} |
        <strong>Beschreibung:</strong> {{ container.description }} |
        <strong>Gewicht:</strong> {{ container.weight }} kg |
        <strong>Schiff:</strong> {{ container.ship.name }}
        <button @click="editContainer(container)">Bearbeiten</button>
        <button @click="deleteContainer(container.id)">Löschen</button>
      </li>
    </ul>
    <ContainerForm
        v-if="showForm"
        :container="selectedContainer"
        @close="closeForm"
        @saved="fetchContainers"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiService from '../services/apiService';
import ContainerForm from './ContainerForm.vue';
import webSocketService from '../services/websocketService';

export default {
  components: { ContainerForm },
  setup() {
    const containers = ref([]);
    const showForm = ref(false);
    const selectedContainer = ref(null);

    const fetchContainers = () => {
      apiService.getContainers().then(response => {
        containers.value = response.data;
      });
    };

    const openCreateModal = () => {
      selectedContainer.value = null;
      showForm.value = true;
    };

    const editContainer = container => {
      selectedContainer.value = container;
      showForm.value = true;
    };

    const deleteContainer = id => {
      if (confirm('Sind Sie sicher, dass Sie diesen Container löschen möchten?')) {
        apiService.deleteContainer(id).then(() => {
          fetchContainers();
        }).catch(error => {
          alert('Fehler beim Löschen des Containers.');
          console.error(error);
        });
      }
    };

    const closeForm = () => {
      showForm.value = false;
    };

    // Implementierung der handleWebSocketMessage für Container
    const handleWebSocketMessage = message => {
      const body = message.body;

      if (typeof body === 'string' && body.startsWith('deleted:')) {
        // Nachricht ist ein Löschbefehl
        const idStr = body.replace('deleted:', '');
        const id = parseInt(idStr, 10);
        if (!isNaN(id)) {
          const containerExists = containers.value.some(container => container.id === id);
          if (containerExists) {
            containers.value = containers.value.filter(container => container.id !== id);
            console.log(`Container mit ID ${id} wurde gelöscht.`);
          } else {
            console.log(`Container mit ID ${id} war bereits gelöscht.`);
          }
        } else {
          console.warn('Ungültige Container-ID in der Löschnachricht:', body);
        }
      } else {
        try {
          const container = JSON.parse(body);
          if (typeof container === 'object' && container !== null && 'id' in container) {
            const index = containers.value.findIndex(c => c.id === container.id);
            if (index !== -1) {
              // Container existiert bereits, aktualisieren
              containers.value[index] = container;
              console.log(`Container mit ID ${container.id} wurde aktualisiert.`);
            } else {
              // Container existiert nicht, hinzufügen
              containers.value.push(container);
              console.log(`Neuer Container mit ID ${container.id} wurde hinzugefügt.`);
            }
          } else {
            console.warn('Unbekanntes Nachrichtenformat:', container);
          }
        } catch (error) {
          console.error('Fehler beim Verarbeiten der WebSocket-Nachricht:', error);
        }
      }
    };

    onMounted(() => {
      fetchContainers();
      webSocketService.connect();
      webSocketService.subscribe('/topic/containers', handleWebSocketMessage);
    });

    return {
      containers,
      showForm,
      selectedContainer,
      openCreateModal,
      editContainer,
      deleteContainer,
      closeForm,
      fetchContainers,
    };
  },
};
</script>

<style scoped>
button {
  margin-left: 10px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>

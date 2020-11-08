<template>
  <div>
    <div v-for="(team, index) in teams" :key="index">
      <table v-if="team.name == estimateTeam">
        <tr v-for="(estimationType, eindex) in team.estimationTypes" :key="eindex">
          <td>{{ card.id }}: {{ card.title }}</td>
          <button class="btn btn-sm btn-secondary smaller-font" @click="deleteCard(card)">
            Delete Card
          </button>
        </tr>
      </table>
    </div>
  </div>
</template>

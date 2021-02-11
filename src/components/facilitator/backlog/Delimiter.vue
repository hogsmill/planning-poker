<template>
  <tr>
    <td>
      Delimiter
      <select :id="id()">
        <option value="tab">
          \t (tab)
        </option>
        <option value="comma">
          , (comma)
        </option>
        <option value="semicolon">
          ; (semicolon)
        </option>
        <option value="colon">
          : (colon)
        </option>
        <option value="space">
          \s (space)
        </option>
      </select>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'scope'
  ],
  methods: {
    id() {
      return this.scope == 'load' ? 'backlog-load-file-separator' : 'backlog-save-file-separator'
    }
  }
}
</script>

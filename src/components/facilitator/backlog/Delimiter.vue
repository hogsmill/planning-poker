<template>
  <div>
    Delimiter
    <select :id="id">
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
  </div>
</template>

<script>
export default {
  props: [
    'id'
  ]
}
</script>

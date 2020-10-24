<template>
  <table class="poker">
    <tr>
      <td>
        <div class="poker-card rounded">
          <div class="poker-card-value">1</div>
        </div>
      </td>
      <td>
        <div class="poker-card back rounded">
          <div class="poker-card-value"></div>
        </div>
      </td>
    </tr>
  </table>
</template>

<style lang="scss">
  td {
    padding: 12px;
  }
  .poker-card {
    height: 144px;
    width: 103px;
    border: 6px solid #888;

    &.back {
      background-image: url("../assets/img/card-back.jpg");
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;
    }

    .poker-card-value {
      font-size: 40px;
      margin-top: 27px;
      font-weight: bold;
      color: #888;
    }
  }
</style>

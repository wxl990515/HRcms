<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <UploadExcel />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadExcel from '@/components/UploadExcel'
export default {
  name: 'Dashboard',
  components:{
    UploadExcel
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

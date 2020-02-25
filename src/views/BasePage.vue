<template>
    <div class="base-page">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BasePage"
    }
</script>

<style scoped>
    .base-page {
        width: 100%;
        height: 100%;
    }
</style>

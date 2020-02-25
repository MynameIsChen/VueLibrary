<template>
    <a v-bind:href="url" class="nav-link">
        <slot></slot>
    </a>
</template>

<script>
    export default {
        name: "NavigationLink",
        props: ["url"],
        data() {
            return {
                propData: "",
            }
        },
        created() {
            console.log("created", this.url);
        }
    }
</script>

<style scoped>
    .nav-link {
        font-size: 0.24rem;
        color: dodgerblue;
    }
</style>

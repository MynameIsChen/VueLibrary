<template>
    <span>
        <slot v-bind:user="user">{{user.lastName}}</slot>
    </span>
</template>

<script>
    export default {
        name: "CurrentUser",
        data() {
            return {
                user: {
                    lastName: "你的姓",
                    firstName: "你的名",
                    tag:"作用域插槽实现更换数据"
                }
            }
        }
    }
</script>

<style scoped>

</style>

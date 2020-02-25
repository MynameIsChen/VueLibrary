<template>
    <button type="submit">
        <!--在插槽slot中添加内容，可以作为后备内容，即默认内容使用-->
        <slot>Submit</slot>
    </button>
</template>

<script>
    export default {
        name: "SubmitButton"
    }
</script>

<style scoped>

</style>

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="options-content">
        插槽讲解：
        <div>
            <navigation-link>
                Your Profile
            </navigation-link>
        </div>

        <div>
            <navigation-link url="/profile">
                <!-- 添加一个 Font Awesome 图标 -->
                <span class="fa fa-user">A</span>
                Your Profile
            </navigation-link>
        </div>

        <div>nothing</div>
        <div>
            <navigation-link></navigation-link>
        </div>

        <div>
            <navigation-link url="/profile">
                Logged in as {{ user.name }}
                <!--Clicking here will send you to: {{ url }}-->
                <!--这里的 `url` 会是 undefined，因为 "/profile" 是_传递给_ <navigation-link> 的而不是在 <navigation-link> 组件*内部*定义的。-->
            </navigation-link>
        </div>
        <div>
            <submit-button></submit-button>
        </div>
        <div>
            <submit-button>Save</submit-button>
        </div>
        <div>
            <base-layout></base-layout>
        </div>

        <div>
            <base-layout>
                <template v-slot:header>
                    <h1>Here might be a page title</h1>
                </template>

                <p>A paragraph for the main content.</p>
                <p>And another one.</p>

                <!--现在 <template> 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 v-slot 的 <template> 中的内容都会被视为默认插槽的内容。-->
                <!--然而，如果你希望更明确一些，仍然可以在一个 <template> 中包裹默认插槽的内容;这样导致没有配置插槽的内容不显示-->

                <template v-slot:default>
                    <p>A paragraph for the main content1.</p>
                    <p>And another one1.</p>
                </template>

                <template v-slot:footer>
                    <p>Here's some contact info</p>
                </template>
            </base-layout>
        </div>
        <div>
            <current-user>
                <!--v-slot:currentUser<slot的命名>；userProps<将包含所有插槽prop的对象命名>-->
                <template v-slot:default="userProps">
                    {{userProps.user.tag}}
                </template>
            </current-user>
        </div>
        <div>
            <!--当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 v-slot 直接用在组件上;-->
            <current-user v-slot:default="userProps">
                {{userProps.user.firstName}}
            </current-user>
        </div>
        <div>
            <!--这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 v-slot 被假定对应默认插槽-->
            <current-user v-slot="userProps">
                {{userProps.user.lastName}}
            </current-user>
        </div>

        <div>
            注意默认插槽的缩写语法不能和具名插槽混用，因为它会导致作用域不明确：
            <!-- 无效，会导致警告 -->
            <!--<current-user v-slot="slotProps">-->
            <!--{{ slotProps.user.firstName }}-->
            <!--<template v-slot:other="otherSlotProps">-->
            <!--slotProps is NOT available here-->
            <!--</template>-->
            <!--</current-user>-->
        </div>
        <div>
            只要出现多个插槽，请始终为所有的插槽使用完整的基于 <\template\> 的语法：
            <current-user>
                <template v-slot:default="slotProps">
                    {{ slotProps.user.firstName }}
                </template>

                <template v-slot:other="otherSlotProps">
                    ...
                </template>
            </current-user>
        </div>

        作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：
        这意味着 v-slot 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。所以在支持的环境下 (单文件组件或现代浏览器)，你也可以使用 ES2015 解构来传入具体的插槽 prop，如下：
        <div>
            <current-user v-slot="{ user }">
                {{ user.firstName }}
            </current-user>
        </div>
        这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 user 重命名为 person：
        <div>
            <current-user v-slot="{ user:person }">
                {{ person.firstName }}
            </current-user>
        </div>
        你甚至可以定义后备内容，用于插槽 prop 是 undefined 的情形：
        <div>
            <current-user v-slot="{ user = { firstName: 'Guest' } }">
                {{ user.firstName }}
            </current-user>
        </div>

        动态插槽名
        <div>
            <base-layout>
                <template v-slot:[dynamicSlotName]>
                    This is A ...{{dynamicSlotName}}
                </template>
            </base-layout>
        </div>

        跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 #。例如 v-slot:header 可以被重写为 #header：
        <div>
            <base-layout>
                <template #header>
                    <h1>Here might be a page title</h1>
                </template>

                <p>A paragraph for the main content.</p>
                <p>And another one.</p>

                <template #footer>
                    <p>Here's some contact info</p>
                </template>
            </base-layout>
        </div>

        然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

        <!-- 这样会触发一个警告 -->
        <!--<current-user #="{ user }">-->
        <!--{{ user.firstName }}-->
        <!--</current-user>-->

        如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：

        <div>
            <current-user #default="{ user }">
                {{ user.firstName }}
            </current-user>
        </div>

        <div>
            <todo-list v-bind:todos="todos">
                <template v-slot:todo="{ todo }">
                    <span v-if="todo.isComplete">✓</span>
                    {{ todo.text }}
                </template>
            </todo-list>
        </div>

    </div>
</template>

<script>
    import NavigationLink from "../components/item/NavigationLink"
    import SubmitButton from "../components/item/SubmitButton"
    import BaseLayout from "../components/item/BaseLayout"
    import CurrentUser from "../components/item/CurrentUser"
    import TodoList from "../components/item/TodoList"

    export default {
        name: "ListOptions",
        components: {
            CurrentUser,
            BaseLayout,
            NavigationLink,
            SubmitButton,
            TodoList
        },
        data() {
            return {
                user: {
                    name: "你的名字"
                },
                dynamicSlotName: "header",
                todos: [
                    {
                        id: '11',
                        text: 'content11',
                        isComplete:true
                    }, {
                        id: '21',
                        text: 'content21',
                        isComplete:false
                    }, {
                        id: '3',
                        text: 'content31',
                        isComplete:true
                    }, {
                        id: '4',
                        text: 'content41',
                        isComplete:true
                    }
                ]
            }
        },
        created() {
            this.dynamicSlotName = "header";
        }
    }
</script>

<style scoped>
    .options-content {
        width: 100%;
        height: 100%;
    }
</style>

<template>
    <div class="container-fluid">
        <RegisterTable />
        <Footer />
    </div>
</template>

<script>
import Footer from '../footer/Foter'
import RegisterTable from './RegisterTable'
export default {
    name: 'Register',
    components: {
        Footer,
        RegisterTable
    }
}
</script>

<style>

</style>
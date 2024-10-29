let app = new Vue({
    el: "#app",
    data: {
        cart: [],
        courses: courses,
    },
    methods: {
        addToCart(courseId) {
            const course = this.courses.find(course => course.id === courseId);

            if (course) {
                this.cart.push(course);
                course.spaces--;
            }
        }
    }    
});

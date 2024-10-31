let app = new Vue({
    el: "#app",
    data: {
        cart: [],
        cartPage: false,
        courses: courses,
    },
    methods: {
        addToCart: function(courseId) {
            let course = this.courses.find(course => course.id === courseId);
        
            if (course) {
                const newCourse = { ...course, quantity: 1 }; 
                const existingCourse = this.cart.find(newCourse => newCourse.id === courseId);

                if (existingCourse) {
                    existingCourse.quantity++;
                } else {
                    this.cart.push(newCourse);
                }
                
                course.spaces--;
            }
        },
        toggle_page: function() { 
            this.cartPage = !this.cartPage;
        }
    },
    computed: {
        cartItemCount: function() {
            return this.cart.length;
        },
        calculateCartQuantity: function() {
            return this.cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
        }
    } 
});

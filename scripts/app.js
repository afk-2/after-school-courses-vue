let app = new Vue({
    el: "#app",
    data: {
        cart: [],
        cartPage: false,
        courses: courses,
        sortAttribute: 'subject',
        sortOrder: 'ascending',
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
        },
        canAddToCart: function() {
            return (course) => course.spaces > 0;
        },
        sortedCourses() {
            let courses = this.courses.slice();
            let modifier = this.sortOrder === 'ascending' ? 1 : -1;

            return courses.sort((a, b) => {
                let valA = a[this.sortAttribute];
                let valB = b[this.sortAttribute];

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return (valA - valB) * modifier;
                }

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return (valA > valB ? 1 : -1) * modifier;
                }

                return 0;
            });
        }
    } 
});

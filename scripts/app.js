let app = new Vue({
    el: "#app",
    data: {
        cart: [],
        cartPage: false,
        courses: courses,
        sortAttribute: 'subject',
        sortOrder: 'ascending',
        name: '',
        phone: '',
        formSubmitted: false,
        formSubmittedMessage: ''
    },
    methods: {
        addToCart: function(courseId) {
            let course = this.findCourse(courseId, this.courses);
        
            if (course) {
                const newCourse = { ...course, quantity: 1 }; 
                const existingCourse = this.findCourse(newCourse.id, this.cart);

                if (existingCourse) {
                    existingCourse.quantity++;
                } else {
                    this.cart.push(newCourse);
                }
                
                course.spaces--;
            }
        },
        removeFromCart: function(courseId) {
            if (!courseId) {
                return; 
            }
        
            const index = this.cart.findIndex(item => item.id === courseId);
        
            if (index !== -1) {
                const quantity = this.cart[index].quantity;
                const originalCourse = this.findCourse(courseId, this.courses);

                this.cart.splice(index, 1);

                if (originalCourse) {
                    originalCourse.spaces += quantity;
                }
            }
        },
        findCourse: function(courseId, array) {
            const course = array.find(item => item.id === courseId);
            return course;
        },
        findCourseId: function(courseId, array) {
            const index = array.findIndex(item => item.id === courseId);
            return index;
        },
        toggle_page: function() { 
            this.cartPage = !this.cartPage;
        },
        filterLetters: function(event) {
            const input = event.target.value;
            const regex = /^[a-zA-Z\s]*$/;

            if (!regex.test(input)) {
                event.target.value = input.replace(/[^a-zA-Z\s]/g, '');
            }

            this.name = event.target.value;
        },
        filterNumbers: function(event) {
            const input = event.target.value;
            const regex = /^[0-9]*$/;

            if (!regex.test(input)) {
                event.target.value = input.replace(/[^0-9]/g, '');
            }

            this.phone = event.target.value;
        },
        validateForm: function(event) {
            event.preventDefault();

            if (this.name && this.phone) {
                this.formSubmitted = true;
                this.formSubmittedMessage = 'Form Submitted!'
            }
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

let app = new Vue({
    el: "#app",
    data: {
        cart: [],
        cartPage: false,
        courses: [],
        sortAttribute: 'subject',
        sortOrder: 'ascending',
        name: '',
        phone: '',
        email: '',
        address: '',
        formSubmitted: false,
        formSubmittedMessage: ''
    },
    methods: {
        fetchCourses: function() {
            fetch("https://after-school-courses-express.onrender.com/collection/courses")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch courses.");
                    }
                    return response.json();
                })
                .then(data => {
                    this.courses = data;
                })
                .catch(error => {
                    console.error("Error fetching courses:", error);     
                })
        },
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

            if (this.name && this.email && this.phone && this.address) {
                this.submitOrder();
                this.formSubmitted = true;
                this.formSubmittedMessage = 'Thank you! Your order has been placed.';
            } else {
                this.formSubmittedMessage = 'Please fill in all the fields.';
            }
        },
        submitOrder: function(event) {
            // Create the order object with the form data
            const order = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                address: this.address,
                cart: this.cart,
            }

            // Send the order data to the back-end
            fetch("http://localhost:3000/collection/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to submit order.");
                }
                return response.json();
            })
            .then(data => {
                this.cart = []; // Clear the cart after successful submission

                //Reset Form Fields
                this.name = '';
                this.phone = '';
                this.email = '';
                this.address = '';
            })
            .catch(error => {
                console.error("Error submitting order:", error);
                this.formSubmittedMessage = "Failed to place order. Please try again.";
            });
        },
        closePopup: function() {
            this.formSubmitted = false; // Close the popup
            this.toggle_page(); // Redirect to homepage
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
    },
    mounted() {
        this.fetchCourses();
    }
    
});

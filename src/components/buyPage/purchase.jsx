import { useState, useEffect } from 'react';
import './PurchaseService.css'; // Import CSS for styling

const PurchaseService = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [message, setMessage] = useState('');
    const [checkoutStep, setCheckoutStep] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_HOST}/products`);
                if (!response.ok) throw new Error("Failed to fetch services");
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
                alert("Error fetching services. Please try again later.");
            }
        };

        fetchServices();
    }, []);

    const handlePayment = (amt, order_id) => {
        const options = {
            key: `${import.meta.env.VITE_REACT_APP_RAZORPAY_SECRET}`,
            amount: amt,
            currency: 'INR',
            name: 'Product Name',
            order_id: order_id,
            description: `Purchase of ${selectedService.name}`, // Set the Razorpay order ID here
            handler: (response) => {
                console.log(response);
                setMessage(`Thank you ${name}, your purchase for ${selectedService.name} (Order ID: ${order_id}) has been received!`);
            },
            prefill: {
                name: name,
                email: email,
            },
            notes: {
                service: selectedService.name,
            },
            theme: {
                color: '#F37254',
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedService) {
            setCheckoutStep(true);
        } else {
            alert("Please select a product.");
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_HOST}/proceedToCheckout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: "66ed6f8d124f8cf364b8fb0d", // dummy for testing
                    productId: selectedService._id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Proceed to Checkout response:", data);
                handlePayment(data.amount, data.paymentGatewayOrderId);
            } else {
                console.error("Failed to proceed to checkout", response.statusText);
                alert("There was an issue with checkout. Please try again.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("There was an error during checkout. Please try again.");
        }
    };

    return (
        <div className="purchase-service-container">
            <h2>Purchase Our Product</h2>

            {!checkoutStep && (
                <>
                    <div className="service-cards">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                                onClick={() => setSelectedService(service)}
                            >
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                <p>Price: ₹{service.price}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Proceed to Checkout</button>
                    </form>
                </>
            )}

            {checkoutStep && (
                <div className="checkout-step">
                    <h3>Confirm your purchase</h3>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
                    <p>Selected Service: {selectedService?.name}</p>
                    <p>Price: ₹{selectedService?.price}</p>
                    <button onClick={handleCheckout}>Confirm and Pay</button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default PurchaseService;

import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomFrom";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";


const AddRoom = () => {
    const { user } = useAuth();
    const [dates, setDates] = useState(
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    );
    // date range handler
    const handleDate = item => {
        console.log(item)
        setDates(item.selection)
    }
    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        const location = form.location.value;
        const category = form.category.value;
        const title = form.title.value;
        const to = dates.endDate;
        const from = dates.startDate;
        const price = form.price.value;
        const guests = form.total_guest.value;
        const bathrooms = form.bathrooms.value;
        const description = form.description.value;
        const bedrooms = form.bedrooms.value;
        const image = form.image.files[0];
        const host = {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL

        }
        try {
            const image_url = await imageUpload(image);
            const roomData = {
                location,
                category,
                title,
                to,
                from,
                price,
                guests,
                bathrooms,
                description,
                bedrooms,
                image: image_url,
                host
            }
            console.table(roomData)
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div>
            <h1>welcome to dashboard host addRoom</h1>
            {/* form */}
            <AddRoomForm dates={dates} handleDate={handleDate} handleSubmit={handleSubmit}></AddRoomForm>
        </div>
    );
};

export default AddRoom;
import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomFrom";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";
import { Helmet } from 'react-helmet-async'
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const AddRoom = () => {

    const axiosSecure = useAxiosSecure()

    const [imagePreview, setImagePreview] = useState()
    const [imageText, setImageText] = useState('Upload Image')
    const { user } = useAuth();
    const [dates, setDates] = useState(
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    );
    // date range handler
    const handleDate = item => {
        setDates(item.selection)
    }

    const { mutateAsync } = useMutation({
        mutationFn: async roomData => {
            const { data } = await axiosSecure.post('/room', roomData);
            console.log(data);
            return data;
        },
        onSuccess: () => {
            console.log('data saved successfully');
        },
    });


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
            // post request to server
            await mutateAsync(roomData)
        } catch (error) {
            console.log(error)
        }


    }



    // handle image change
    const handleImage = image => {
        setImagePreview(URL.createObjectURL(image))
        setImageText(image.name)
    }

    return (

        <>
            <Helmet>
                <title>AddRoom | Dashboard</title>
            </Helmet>
            <AddRoomForm
                dates={dates}
                handleDate={handleDate}
                handleSubmit={handleSubmit}
                setImagePreview={setImagePreview}
                imagePreview={imagePreview}
                handleImage={handleImage}
                imageText={imageText}
            ></AddRoomForm>
        </>
    );
};

export default AddRoom;
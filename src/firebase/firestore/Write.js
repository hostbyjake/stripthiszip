import { db } from '@/firebase/initFirebase'
import { doc, setDoc, Timestamp, GeoPoint } from "firebase/firestore"
import { useUser } from '@/firebase/useUser'
import {
    Button
} from '@chakra-ui/react'
const WriteToCloudFirestore = () => {
    const { user } = useUser()
    const sendData = async () => {
        try {
            const userDoc = doc(db, "clients", 'vivify')
            await setDoc(userDoc, {
                ENTRY: [{ FROM: 'jjones@bsgtech.com', FOLDER: 'jakeFolder'}, {FROM: 'mschuler@bsgtech.com', FOLDER: 'mattFolder'}]
                // array_data: ['text', 4],
                // null_data: null,
                // time_stamp: Timestamp.fromDate(new Date('December 17, 1995 03:24:00')),
                // geo_point: new GeoPoint(34.714322, -131.468435)
            })
            alert('Data was successfully sent to cloud firestore!')
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    return (
        <div style={{ margin: '5px 0' }}>
            <Button onClick={sendData} style={{ width: '100%' }}>Send</Button>
        </div>
    )
}

export default WriteToCloudFirestore
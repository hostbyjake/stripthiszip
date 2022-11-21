import { db } from '@/firebase/initFirebase'
import { doc, getDoc } from "firebase/firestore"
import { useUser } from '@/firebase/useUser'
import { 
    Button
} from '@chakra-ui/react'

const ReadDataFromCloudFirestore = () => {
    const { user } = useUser()
    const readData = async () => {
        try {
            const userDoc = doc(db, "clients", 'vivify')
            await getDoc(userDoc).then((doc) => {
                if (doc.exists()) {
                    console.log(doc.data())
                }
            })
            alert('Data was successfully fetched from cloud firestore! Close this alert and check console for output.')
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    return (
        <div style={{ margin: '5px 0' }}>
            <Button onClick={readData} style={{ width: '100%' }}>Read</Button>
        </div>
    )
}

export default ReadDataFromCloudFirestore
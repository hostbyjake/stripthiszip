import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

const ActiveLink = () => {
    const router = useRouter()
    const isActive = router.pathname === '/'

    return (
        <NextLink href={'/'} passHref>
            <Link color={isActive ? 'red' : 'blue'}>Link</Link>
        </NextLink>
    )
}



export default ActiveLink
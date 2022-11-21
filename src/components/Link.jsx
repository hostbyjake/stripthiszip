import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

const CustomLink = ({ href, text }) => {
    return (
        <NextLink href={href} passHref>
            <Link>{text}</Link>
        </NextLink>
    )
}

export default CustomLink



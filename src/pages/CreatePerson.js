import React from 'react'
import TestUser from '../UserExample';
import FormCreateEmployee from '../forms/FormCreateEmployee';
import FormCreateCustomer from '../forms/FormCreateCustomer';


export default function CreatePerson() {

    return (TestUser.role === "admin" ?
        <FormCreateEmployee /> :
        <FormCreateCustomer />
    )
}

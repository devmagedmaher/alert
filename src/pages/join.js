import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form';
import {
  Button,
  Stack,
} from '@mantine/core';
import Layout from '../components/Layout';
import Input from '../components/input';

const JoinPage = () => {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      kitchen: '',
      name: '',
    },
    validate: {
      kitchen: val => val === '' ? 'Please enter the kitchen code' : null, 
      name: val => val === '' ? 'Please enter your name' : null, 
    }
  })

  const goToKitchen = () => {
    form.validate()
    if (form.isValid()) {
      const { name, kitchen  } = form.values
      // store name in local storage
      localStorage.setItem('name', name)
      localStorage.setItem('id', `${Math.floor(Math.random() * 1000)}${Date.now()}`)

      // go to kitchen page
      navigate(`/r/${kitchen}`)
    }
  }

  return (
    <Layout>
      <Stack>
        <Input
          name="kitchen"
          label="Kitchen Code"
          value={form.values.kitchen}
          error={form.errors.kitchen}
          onChange={text => form.setFieldValue('kitchen', text)}
          onEnter={goToKitchen}
          size="lg"
        />
        <Input
          name="name"
          label="Your name"
          value={form.values.name}
          error={form.errors.name}
          onChange={text => form.setFieldValue('name', text)}
          onEnter={goToKitchen}
          size="lg"
        />

        <Button
          onClick={goToKitchen}
          variant="outline"
          size='md'
        >Join {'>>'}</Button>
      </Stack>
    </Layout>
  )
}

export default JoinPage;
import {useEffect, useState} from 'react'

import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import Input from '../form/input'
import styles from './ProjectForm.module.css'

function ProjectForm({handleSubmit, btnText, projectData}){

    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || [])

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => res.json())
    .then((data) => {
        setCategories(data)
    })
    .catch(err => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value})
    }
    
    function handleCategory(e){
        setProject({...project, category: {
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
        },
     })
    }

    return(
        <form onSubmit={submit} className={styles.form}>
            <Input type='text' 
                    text="Nome do Projeto" 
                    name='name'  
                    placeholder="Insira o Nome do Projeto" 
                    handleOnChange={handleChange} 
                    value={project.name ? project.name: '' } 
                    />
            <Input type='number' 
                    text="Orçamento do Projeto" 
                    name='budget'  
                    placeholder="Insira o Orçamento do Projeto" 
                    handleOnChange={handleChange} 
                    value={project.budget ? project.budget: '' } 
                    />
            <Select name="category_id" 
                    text="Selecione a categoria" 
                    options={categories} 
                    handleOnChange={handleCategory} 
                    value={project.category ? project.category.id: ''} 
                    />
            <SubmitButton text={btnText} />
        </form>
    )
}
export default ProjectForm

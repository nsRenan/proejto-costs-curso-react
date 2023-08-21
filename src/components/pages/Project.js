import Styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {parse, v4 as uuidv4} from 'uuid'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard  from '../service/ServiceCard'

function Project(){

    const {id} = useParams()
    
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() =>{
            fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
        })
        .catch(err => console.log(err))
        }, 300)
    }, [id])

    function editPost(project){
        setMessage('')

        // budget validations
        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        }).then(res => res.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto Atualizado')
            setType('success')
        })
        .catch(err => console.log(err))
    }

    function createService(project){
        setMessage('')

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            setTimeout(() => {setMessage('');}, 3000)
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers:{ 'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((res) => res.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))
    }

    function removeService (id, cost) {

        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = (parseFloat(projectUpdated.cost)) - (parseFloat(cost))

            fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectUpdated)
            }).then(res => res.json())
            .then((data) => {
                setProject(projectUpdated)
                setServices(servicesUpdated)
                setMessage('Serviço Removido com Sucesso')
            })
            .catch(err => console.log(err))
    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }
    
    

    return(<>
        {project.name ? (
            <div className={Styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message} />}
                    <div className={Styles.details_container}>
                        <h1>
                            Projeto: {project.name}
                        </h1>
                        <button className={Styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? "Editar Projeto" : "Fechar"}
                        </button>
                        {!showProjectForm ? (
                            <div className={Styles.project_indo}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizado:</span> R${project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={Styles.project_indo}> 
                                <ProjectForm 
                                    handleSubmit={editPost} 
                                    btnText="Concluir Edição" 
                                    projectData={project} />
                            </div>
                        )}
                    </div>
                    <div className={Styles.service_form_container}>
                            <h2>Adcione um serviço</h2>
                            <button className={Styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? "Adcionar Serviço" : "Fechar"}
                            </button>
                            <div className={Styles.project_indo}>
                                {showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        textBtn='Adcionar Serviço'
                                        projectData={project}
                                    />
                                )}
                            </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard 
                                      id={service.id}  
                                      name={service.name}  
                                      cost={service.cost}  
                                      description={service.description}  
                                      key={service.key}  
                                      handleRemove={removeService}  
                                    />
                                ))
                            }
                            {services.length === 0 && <p> Não há serviços cadastrados </p> }
                    </Container>
                </Container>
            </div>
        ): (
            <Loading />
        )}
        </>
        )

}

export default Project
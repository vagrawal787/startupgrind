import React, { Component, useState } from 'react'
import {
    Button, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupText, Input, Card,
    ListGroupItemHeading, ListGroupItemText, Label, Collapse
} from 'reactstrap'
import Data from './eventData.jsx'

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //each state variable represents the corresponding filter
            //the "over" variables are the lower bounds for the numerical quantities
            //the "under variables" are the upper bounds for the numerical quantities 
            tickets_sold_over: 0,
            tickets_sold_under: 1000000,
            revenue_over: 0,
            revenue_under: 10000000,
            attendees_over: 0,
            attendees_under: 10000000,
            checkin_over: 0,
            checkin_under: 1000000,
            //"published" determines whether to limit entries to only those that have been published
            published: false,
            //"date" determines whether to limit entries to only those after Jan 1, 2019
            date: false,
            isOpen: false,
        }
        //handle filter input
        this.handleInput = this.handleInput.bind(this)
        //handle button clicks for prompt responses
        this.buttonClick = this.buttonClick.bind(this)
        //toggles the visibility of the filters
        this.toggle = this.toggle.bind(this)
    }


    /* Activated everytime a button is clicked. This is to automatically set the filters
    for each prompt in the project specification. 
    Parameters: e - button click event object*/
    buttonClick(e) {
        switch (e.target.name) {
            //corresponds to showing all events that are published
            case "allpublished":
                this.setState({
                    tickets_sold_over: 0,
                    tickets_sold_under: 1000000,
                    revenue_over: 0,
                    revenue_under: 10000000,
                    attendees_over: 0,
                    attendees_under: 10000000,
                    checkin_over: 0,
                    checkin_under: 1000000,
                    published: true,
                    date: false
                })
                break;
            //corresponds to showing all events with over 100 total_attendees and over 50 checkin_count
            case "over100":
                this.setState({
                    tickets_sold_over: 0,
                    tickets_sold_under: 1000000,
                    revenue_over: 0,
                    revenue_under: 10000000,
                    attendees_over: 100,
                    attendees_under: 10000000,
                    checkin_over: 50,
                    checkin_under: 1000000,
                    published: false,
                    date: false
                })
                break;
            //corresponds to showing all events with revenue between 900 and 2000
            case "betweenrevenue":
                this.setState({
                    tickets_sold_over: 0,
                    tickets_sold_under: 1000000,
                    revenue_over: 900,
                    revenue_under: 2000,
                    attendees_over: 0,
                    attendees_under: 10000000,
                    checkin_over: 0,
                    checkin_under: 1000000,
                    published: false,
                    date: false
                })
                break;
            //corresponds to showing all events after Jan 1, 2019
            case "startdate":
                this.setState({
                    tickets_sold_over: 0,
                    tickets_sold_under: 1000000,
                    revenue_over: 0,
                    revenue_under: 10000000,
                    attendees_over: 0,
                    attendees_under: 10000000,
                    checkin_over: 0,
                    checkin_under: 1000000,
                    published: false,
                    date: true
                })
                break;
            case "reset":
                this.setState({
                    tickets_sold_over: 0,
                    tickets_sold_under: 1000000,
                    revenue_over: 0,
                    revenue_under: 10000000,
                    attendees_over: 0,
                    attendees_under: 10000000,
                    checkin_over: 0,
                    checkin_under: 1000000,
                    published:false,
                    date:false
                })
        }
    }

    /* Activated everytime an input field is changed in the filters menu. 
    Depending on the name of the input, updates state values that are typed in
    and dynamically filters the entries displayed based on the filter quantities
    Parameters: 
        e - input event object*/
    handleInput(e) {
        //store the name of the input element and value inserted into the input element
        let name = e.target.name;
        let value = e.target.value;
        //handles null case, when there is no input in the numerical inputs, ensures that the default
        //value is not null
        if (value.length == 0) {
            if (name.includes("under")) {
                value = 10000000;
            } else if (name.includes("over")) {
                value = 0;
            }
        }
        //handles the published case, so that everytime the checkbox is clicked, the published state is flipped 
        if (name != "published") {
            this.setState({ [name]: value })
        } else {
            this.setState({ published: !this.state.published })
        }
    }


    // toggles the visibility of the filters
    toggle(e) {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {

        /* Main filter method to dynamically render different entries based on the state of the filter variables.
        Uses json file defined in eventData.jsx. */
        const cards = Data.results.filter((data) => {
            //store current data entry into variables
            let revenue = data.total_revenue
            let tickets = data.total_tickets_sold
            let attendees = data.total_attendees
            let checkin = data.checkin_count
            //for the date, separate day, month, and year to allow for easy comparison
            let year = parseFloat(data.start_date.substring(0, 4))
            let month = parseFloat(data.start_date.substring(5, 7))
            let day = parseFloat(data.start_date.substring(8, 10))
            //handles null case, in case revenue is null, compare as 0 to avoid issues in comparison
            if (data.total_revenue == null) {
                revenue = "0";
            }
            //handles false case in tickets, compare as 0 to avoid issues in comparison
            if (data.total_tickets_sold == false) {
                tickets = 0
            }
            /* Comparison sequence to determine whether given data entry should be rendered.
            For numerical variables, if corresponding data value is above the "over" state variable
            and below the "under" state variable, then it passes the check. For "published", if the 
            given data entry has status "published" and the state "published" value is selected, it passes the check. 
            For date, if the state has the "date" filter selected, then if the date of data entry is after Jan 1, 2019,
            it passes the check. */
            if (this.state.date && year >= 2019 && month >= 1 && day >= 19 || !this.state.date) {
                if ((tickets >= this.state.tickets_sold_over && tickets <= this.state.tickets_sold_under) && (parseFloat(revenue) >= this.state.revenue_over && parseFloat(revenue) <= this.state.revenue_under) &&
                    (attendees >= this.state.attendees_over && attendees <= this.state.attendees_under) && (checkin >= this.state.checkin_over && checkin <= this.state.checkin_under)) {
                    if (this.state.published && data.status == "Published") {
                        return data
                    } else if (!this.state.published) {
                        return data
                    }
                }
            }
        }).map(data => {
            //for each data entry that passes the filter, generate a line in the list with information about the event
            return (
                <ListGroupItem>
                    <ListGroupItemHeading>{data.title}</ListGroupItemHeading>
                    <ListGroupItemText>
                        <p>Dates: {data.start_date} to {data.end_date}</p>
                        <p> Status: {data.status}, {data.total_tickets_sold} tickets sold</p>
                    </ListGroupItemText>
                </ListGroupItem>
            )
        })

        return (
            <div>
                {/* Button to collapse and open filters tab */}
                <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Filters</Button>
                <Collapse isOpen={this.state.isOpen}>
                    <Card>
                        <br />
                        <b>
                            Tickets Sold
                        </b>
                        {/* Each Input Group corresponds to one filter. The input group contains
                        the over and under input boundary on one line. This input gets passed into the state. */}
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Over
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.tickets_sold_over} name="tickets_sold_over" placeholder="# of tickets" onChange={this.handleInput}></Input>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Under
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.tickets_sold_under} name="tickets_sold_under" placeholder="# of tickets" onChange={this.handleInput}></Input>
                        </InputGroup>
                        <br />

                        <b>
                            Total Revenue
                        </b>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Over
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.revenue_over}name="revenue_over" placeholder="revenue ($)" onChange={this.handleInput}></Input>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Under
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.revenue_under} name="revenue_under" placeholder="revenue ($)" onChange={this.handleInput}></Input>
                        </InputGroup>
                        <br />

                        <b>
                            Total Attendees
                        </b>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Over
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.attendees_over} name="attendees_over" placeholder="# of attendees" onChange={this.handleInput}></Input>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Under
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.attendees_under}name="attendees_under" placeholder="# of attendees" onChange={this.handleInput}></Input>
                        </InputGroup>
                        <br />

                        <b>
                            Check-in Count
                        </b>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Over
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.checkin_over} name="checkin_over" placeholder="# of check-ins" onChange={this.handleInput}></Input>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    Under
                        </InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value = {this.state.checkin_under} name="checkin_under" placeholder="# of check-ins" onChange={this.handleInput}></Input>
                        </InputGroup>
                        <br />

                        {/* This is the checkbox for selecting whether or not to only show published events */}
                        <Label check>
                            <Input name="published" type="checkbox" onChange={this.handleInput} checked = {this.state.published}/>{' '}
                        Only show Published Events
                    </Label>

                        <br />
                        {/* These buttons are for the StartupGrind prompt. Each one corresponds with one 
                        of the categories we were tasked with showing. Each button click immediately sets the filters
                        to match what was required by the prompt */}
                        <div>
                            <Button name="allpublished" color="primary" onClick={this.buttonClick}>All Published Events</Button>{' '}
                            <Button name="over100" color="primary" onClick={this.buttonClick}>All Events with over 100 total_attendees and over 50 checkin_count</Button>{' '}
                            <Button name="betweenrevenue" color="primary" onClick={this.buttonClick}>All Events with between 900.00 and 2000.00 in total_revenue</Button>{' '}
                            <Button name="startdate" color="primary" onClick={this.buttonClick}>All Events with a start_date in since Jan 1, 2019</Button>{' '}
                            <Button name="reset" color="primary" onClick={this.buttonClick}>Reset Filters</Button>{' '}
                        </div>

                        <br />

                    </Card>
                </Collapse>

                <br />

                {/* list all the entries generated by the filter and map functions */}

                <ListGroup>
                    {cards}
                </ListGroup>
            </div>
        )
    }
}

export default MainPage;
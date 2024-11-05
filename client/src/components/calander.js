"use client"

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import "./calander.css"

export default function CalendarPage() {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([
    { id: 1, title: "Project Review", date: new Date(2024, 2, 15), type: "meeting" },
    { id: 2, title: "Submission Deadline", date: new Date(2024, 2, 20), type: "deadline" },
  ])

  const addEvent = (newEvent) => {
    setEvents([...events, { id: events.length + 1, ...newEvent }])
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Calendar</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>View and manage your appointments and deadlines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Event</CardTitle>
            <CardDescription>Schedule a new event.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Event</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Event</DialogTitle>
                  <DialogDescription>Fill in the details to add a new event to your calendar.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="Event title" />
                  </div>
                  <div>
                    <Label htmlFor="event-date">Event Date</Label>
                    <Input id="event-date" type="date" onChange={(e) => setDate(new Date(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => addEvent({ title: "Sample Event", date, type: "meeting" })}>Save Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

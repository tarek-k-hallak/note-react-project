import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import { nanoid } from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(() => {
        return JSON.parse(localStorage.getItem("notesData")) || []
    })
    const [currentNoteId, setCurrentNoteId] = React.useState((notes[0] && notes[0].id) || "")

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }

    function updateNote(text) {
        //rearrange the most recently note we modified to be at the top d
        setNotes(oldNotes => {
            let newNotes = []
            for (let i = 0; i < oldNotes.length; i++) {
                if (oldNotes[i].id === currentNoteId) {
                    newNotes.unshift({ ...oldNotes[i], body: text })
                } else {
                    newNotes.push(oldNotes[i])
                }
            }
            return newNotes
        })
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    function deleteNote(event, noteId) {
        //to disple clicking on the parent
        //so it will not set the current note id to its id
        event.stopPropagation()
        setNotes(oldNotes => {
            let newNote = []

            for (let i = 0; i < oldNotes.length; i++) {
                if (oldNotes[i].id === noteId) continue
                else {
                    newNote.push(oldNotes[i])
                }
            }
            return newNote
        })
        // Another way
        //setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))

    }

    React.useEffect(() => {
        localStorage.setItem("notesData", JSON.stringify(notes))
    }, [notes])

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split">
                        <Sidebar
                            notes={notes}
                            currentNote={findCurrentNote()}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote} />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={findCurrentNote()}
                                updateNote={updateNote} />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}

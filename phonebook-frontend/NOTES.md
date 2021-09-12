
This project corresponds to the exercises here:
https://fullstackopen.com/en/part2/forms#exercises-2-6-2-10

# Phonebook

Exercises Involved
- 2.6: Names only. Be able to add a name to the phonebook.
- 2.7: Prevent the user from adding a name if it already exists in the dataset.
  - Note: This means it is completely safe to use the name as a unique id.
- 2.8: Allow users to add phone numbers to the phonebook.
- 2.9: Add a filter feature that only includes names with a matching substring.
- 2.10: Refactor into seperate components.
- 2.11: Move the data of the app to a json database.
- 2.15: Make it so that added numbers are added to the database.
- 2.16: Move code that communicates with the server to its own module.
- 2.17: Allow users to delete phonebook entries.
  - Use `window.confirm()` for a confirmation window.
  - Use `axios.delete()` to send a `DELETE` request.
- 2.18: Make it so that if someone's info is already in the phonebook, we update
        it after a confirmation window.
- 2.19: Add a notification that appears after a successful operation.
- 2.20: Make sure that deleting a person from one client and trying to update that
        person from another client is handled gracefully. Also handle double deletion.
        These should create notifications that look different from normal ones.
  - Note: The error will probably still appear in the console. That is fine.

## Controlled Components

It is important for us to dictate the state of controlled components, but also
for us to handle changes to component that impact the state. For example, we set
the newName fields value to be newName, and its onChange to be a handler that
updates newName.

## PUT vs POST

POST to the array to add an entry. PUT to an element of the array to update or
overwrite the info. PATCH to an element of the array to overwrite only parts of
the info.

## One remaining problem

Two clients might post info on the same person, in which case the database ends
up with two copies. It would be best if we could ask the database if this person
exists, rather than look at only our local copy of the data.

This could be solved now by having the browser pull down a copy of all the data
every time it wants to make a post, but this seems expensive and seems to violate
the idea of REST and SPAs (but I don't really know this). We need some way to either:
- ask the server if it sees an entry that looks like X, OR
- tell the server to overwrite the entry that looks like X, or add a new entry if
  needed (but then we would not be able to put up a confirmation box in the case of
  overwrite).

## window.clearTimeout()

A tricky problem arose were, if you did things too fast, the second notification
would disapeear way to early.

Usually we had:
- 0s: Some action occurs, a notification is set to self destruct at 5s.
- 5s: The notification is set to null.
- 6s: Some other action occurs...

But here we had:
- 0s: Some action occurs, a notification is set to self destruct at 5s.
- 4s: Another action occurs, and the notification is updated.
- 5s: The notification is set to null. (Shit: It only last one second)...

The solution: store the timeout variable in the notification state. Call
`window.clearTimeout()` on it before we add a new notification, preventing it 
from deleting our notification too early.

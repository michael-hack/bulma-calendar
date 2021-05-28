<template>
    <input ref="cal" :type="type" />
</template>

<script>

    import bulmaCalendar from "bulma-calendar/dist/js/bulma-calendar.min";

    export default {
        data() {
            return {
                date: [null, null],
            }
        },
        props: {
            clearable: {
                type: Boolean,
                default: false
            },
            dialog: {
                type: Boolean,
                default: false
            },
            inline: {
                type: Boolean,
                default: false
            },
            range: {
                type: Boolean,
                default: false
            },
            options: {
                type: Object,
                default() { return {}; }
            },
            type: {
                type: String,
                default: 'datetime'
            },
            value: Date|Array|null
        },
        mounted() {

            // Set date
            if (this.range) {
                if (this.value instanceof Array) {
                    this.date = this.value;
                }
            } else {
                this.date[0] = this.value;
            }

            // Attach Calendar
            const calendar = bulmaCalendar.attach(this.$refs.cal, {
                ...this.options,
                displayMode:     this.inline ? 'inline' : (this.dialog ? 'dialog' : 'default'),
                isRange:         this.range,
                showClearButton: this.clearable,
                startDate:       this.date[0],
                startTime:       this.date[0],
                endDate:         this.date[1],
                endTime:         this.date[1],
            });

            // Event Handler
            calendar[0].on('save', e => {

                this.date = [e.data.startDate, e.data.endDate];

                if (this.range) {
                    this.$emit('input', this.date);
                    return;
                }

                this.$emit('input', this.date[0]);

            });

            calendar[0].on('select', e => {

                if (this.range) {
                    this.$emit('select', [e.data.startDate, e.data.endDate]);
                    return;
                }

                this.$emit('select', e.data.startDate);

            });

        }
    }

</script>

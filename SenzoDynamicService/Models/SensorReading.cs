using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SenzoDynamicService.Models
{
    public class SensorReading
    {
        public string DeviceId { get; set; }

        public string SensorName { get; set; }

        public string Value { get; set; }

        public SensorReading()
        {
        }
    }
}
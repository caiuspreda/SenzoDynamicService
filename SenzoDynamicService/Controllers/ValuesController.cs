using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Swashbuckle.Swagger.Annotations;
using SenzoDynamicService.Models;
using SenzoDynamicService.Data.Provider;

namespace SenzoDynamicService.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        [SwaggerOperation("GetAll")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [SwaggerOperation("GetById")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [SwaggerOperation("Create")]
        [SwaggerResponse(HttpStatusCode.OK, "Sensor value saved.", typeof(SensorReading))]
        public HttpResponseMessage Post([FromBody]SensorReading sensorReading)
        {
            TableStorageProvider<SensorReadingEntry> storageProvider = new TableStorageProvider<SensorReadingEntry>("SensorData");

            SensorReadingEntry sre = new SensorReadingEntry();
            sre.PartitionKey = sensorReading.DeviceId;
            sre.RowKey = sensorReading.SensorName;
            sre.Value = sensorReading.Value;
            sre.UtcTicks = DateTime.UtcNow.Ticks;
            storageProvider.Insert(sre);

            return Request.CreateResponse<SensorReading>(HttpStatusCode.OK, sensorReading);
        }

        // POST api/values
        //[SwaggerOperation("Dummy")]
        //[SwaggerResponse(HttpStatusCode.OK, "Dummy", typeof(int))]
        //public HttpResponseMessage Post([FromBody]int sensorReading)
        //{
        //    return Request.CreateResponse<int>(HttpStatusCode.OK, 10);
        //}

        // PUT api/values/5
        [SwaggerOperation("Update")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [SwaggerOperation("Delete")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public void Delete(int id)
        {
        }
    }
}
